import { useState } from "react";
import { nanoid } from 'nanoid';

import { generate } from './utils/generate';
import { Model } from './type';

const JSONEditor = ({ value, setValue }: { value: string, setValue: (value: string) => void }) => {
  return (
    <div>
      <h1>JSON</h1>
      <textarea
        style={{ width: 400, height: 400 }}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Type your json"
      />
    </div>
  );
}

const Models = (
  {
    models,
    handleAddModel,
    handleRemoveModel,
    handleChangeModelName,
    handleChangeModelValue,
  }:
  {
    models: Model[],
    handleAddModel: () => void,
    handleRemoveModel: (id: string) => void,
    handleChangeModelName: (id: string, value: string) => void,
    handleChangeModelValue: (id: string, value: string) => void,
  }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 500, zIndex: 1 }}>
      <button type="button" onClick={handleAddModel} style={{ width: 200, height: 50 }}>Add Model</button>
      {models.map(model => {
        return (
          <div key={model.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h2>Model - {model.name}</h2>
            <input
              placeholder="model name"
              onChange={(e) => handleChangeModelName(model.id, e.currentTarget.value)}
              style={{ height: 40 }}
            />
            <textarea
              placeholder="Type your json"
              style={{ width: 350, height: 250 }}
              value={model.value}
              onChange={(e) => handleChangeModelValue(model.id, e.currentTarget.value)}
            />
            <button type="button" onClick={() => handleRemoveModel(model.id)}>REMOVE!</button>
          </div>
        );
      })}
    </div>
  );
};

const Generate = ({ onGenerate }: { onGenerate: () => void }) => {
  return (
    <button type="button" onClick={onGenerate} style={{ margin: 10, height: 40 }}>Generate!</button>
  )
}

const GenerateField = ({ value }: { value: string }) => {
  return (
    <textarea readOnly style={{ height: 400 }} value={JSON.stringify(value, null, 2)} />
  );
}

const App = () => {
  const [json, setJson] = useState<Model>({ id: nanoid(), name: '@JSON', value: ''});
  const [models, setModels] = useState<Model[]>([]);
  const [generatedValue, setGeneratedValue] = useState('')

  const handleGenerate = () => {
    const result = generate(json, models);

    try {
      setGeneratedValue(JSON.parse(result));
    } catch (err) {
      setGeneratedValue(err.message);
    }
  }

  const handleSetJson = (value: string) => {
    setJson({
      ...json,
      value,
    });
  };

  const handleAddModel = () => {
    setModels([
      ...models,
      {
        id: nanoid(12),
        name: '',
        value: '',
      }
    ]);
  };

  const handleRemoveModel = (modelId: string) => {
    setModels((models) => {
      return models.filter((model) => model.id !== modelId)
    })
  }

  const handleChangeModelName = (modelId: string, name: string) => {
    setModels((models) => {
      return models.map((model) => {
        if (model.id === modelId) {
          return {
            id: model.id,
            name,
            value: model.value
          };
        }

        return model;
      });
    });
  }

  const handleChangeModelValue = (modelId: string, value: string) => {
    setModels((models) => {
      return models.map((model) => {
        if (model.id === modelId) {
          return {
            id: model.id,
            name: model.name,
            value,
          };
        }

        return model;
      });
    });
  };

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center' }}>
      <div>
        <JSONEditor
          value={json.value}
          setValue={handleSetJson}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Generate onGenerate={handleGenerate}/>
          <GenerateField value={generatedValue}/>
        </div>
      </div>
      <Models
        models={models}
        handleAddModel={handleAddModel}
        handleRemoveModel={handleRemoveModel}
        handleChangeModelName={handleChangeModelName}
        handleChangeModelValue={handleChangeModelValue}
      />
      <div style={{ position: 'fixed', bottom: 20, right: 30, width: 50, height: 30 }}>
        <a href="https://github.com/geewoo94/generate-mock-data">GITHUB</a>
      </div>
    </div>
  );
};

export default App;
