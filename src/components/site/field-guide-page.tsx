import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import {
  fieldRecipes,
  TOOL_LABEL,
  type FieldRecipe,
} from "./field-guide-data";

function RecipeCard({ recipe }: { recipe: FieldRecipe }) {
  return (
    <article className="ac-recipe" id={recipe.id}>
      <header className="ac-recipe-head">
        <span className="ac-recipe-num">{recipe.number}</span>
        <div className="ac-recipe-titles">
          <h2 className="ac-recipe-title">{recipe.title}</h2>
          <p className="ac-recipe-when">{recipe.when}</p>
        </div>
        <span className={`ac-recipe-tool ac-recipe-tool--${recipe.tool}`}>
          {TOOL_LABEL[recipe.tool]}
        </span>
      </header>
      <ol className="ac-recipe-steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="ac-recipe-done">
        <span>Done when</span>
        {recipe.doneWhen}
      </p>
    </article>
  );
}

export function FieldGuidePage() {
  return (
    <SiteChrome loginRedirect="/gnomah">
      <div className="ac-service-page ac-field-guide ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Field guide</span>
            <h1 className="ac-service-title">Recipes for the climb</h1>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede">
                A recipe is a climb you can run again. A field guide is how you
                know the terrain. These eight are the lingua franca — not a
                demo, not a thread.
              </p>
              <p className="ac-service-lede ac-service-lede--last">
                Read them in order the first time. After that, open the one
                you are on.
              </p>
            </div>
          </header>

          <div className="ac-recipe-list">
            {fieldRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <p className="ac-field-guide-foot">
            <Link to="/climb-notes">Read published Climb Notes</Link>
            <span aria-hidden> · </span>
            <Link to="/service">How we help you climb</Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
